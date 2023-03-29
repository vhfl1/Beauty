/* 
 * 김동근
 * MyShopDAO
 */

package kr.co.beauty.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishVO {
	private int wishNo;
	private int prodNo;
	private String uid;
	private String rdate;
	
	//Add
	private String prodName;
	private int price;
	private int disPrice;
	private String thumb1;
	
	public int getSalePrice() {
		return (price-disPrice);
	}
	
}
