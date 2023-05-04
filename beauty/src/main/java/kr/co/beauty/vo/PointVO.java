package kr.co.beauty.vo;

import groovy.transform.ToString;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PointVO {
	private int ordNo;
	private String ordDate;
	private int savePoint;
	private int usedPoint;
	private int ordComplete;
	
	
	public String getOrdDate() {
		return ordDate.substring(2,10);
	}

}
